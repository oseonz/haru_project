import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../slices/loginSlice";
import FormInput from "../../components/mypage/FormInput";
import FormSelect from "../../components/mypage/FormSelect";
import ProfileImage from "../../components/mypage/ProfileImage";
import SubLayout from "../../layout/SubLayout";
import {
  updateProfile,
  updatePhoto,
  updateMemberWithImage,
} from "../../api/authIssueUserApi/memberApi";
import { getCookie } from "../../utils/cookieUtils";
//import { uploadProfileImageWithCleanup } from "../../utils/imageUpload/uploadImageToSupabase";

export default function EditProfile() {
  // const user = useSelector((state) => state.login.user);
  // const dispatch = useDispatch();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    birthAt: "",
    gender: "FEMALE",
    height: "",
    weight: "",
    activityLevel: "MODERATE", // Fixed to match backend
    photo: "",
  });

  // 🔥 사용자 데이터 가져오기 방법 변경
  useEffect(() => {
    const memberData = getCookie("member");

    if (memberData || loginState) {
      setForm({
        name: memberData?.nickname || loginState?.nickname || "",
        birthAt: memberData?.birthAt || loginState?.birthAt || "",
        gender: memberData?.gender || loginState?.gender || "FEMALE",
        height: memberData?.height || loginState?.height || "",
        weight: memberData?.weight || loginState?.weight || "",
        activityLevel:
          memberData?.activityLevel || loginState?.activityLevel || "MODERATE",
        photo: memberData?.photo || loginState?.photo || "",
      });
    }
  }, [loginState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Optimized image upload using new function
  const handlePhotoChange = async (file) => {
    try {
      setIsLoading(true);
      console.log("🖼️ Starting profile image upload...");

      // Get current image URL for cleanup
      const currentImageUrl =
        form.photo || currentUser.photo || currentUser.profileImageUrl;
      console.log("🖼️ Current image URL for cleanup:", currentImageUrl);

      // Upload optimized profile image to Supabase with cleanup
      const uploadResult = await uploadProfileImageWithCleanup(
        file,
        currentImageUrl
      );
      console.log("✅ Profile image upload result:", uploadResult);

      // Get current user ID from cookies
      const user = getUserData();
      if (!user) {
        throw new Error("User not found in cookies");
      }

      const memberId = user.memberId || user.id;
      if (!memberId) {
        throw new Error("Member ID not found");
      }

      // Update backend with new photo URL
      const response = await updatePhoto(uploadResult.imageUrl);

      // Update form and Redux state with new photo URL
      setForm((prev) => ({ ...prev, photo: uploadResult.imageUrl }));
      dispatch(editProfile({ ...currentUser, photo: uploadResult.imageUrl }));

      console.log("📊 Image optimization stats:");
      console.log(
        "   Original size:",
        (uploadResult.originalSize / 1024).toFixed(2),
        "KB"
      );
      console.log(
        "   Optimized size:",
        (uploadResult.optimizedSize / 1024).toFixed(2),
        "KB"
      );
      console.log(
        "   Compression ratio:",
        (
          (1 - uploadResult.optimizedSize / uploadResult.originalSize) *
          100
        ).toFixed(1) + "%"
      );

      alert("프로필 사진이 업로드되었습니다.");
    } catch (error) {
      const message =
        error.response?.data?.message || "프로필 사진 업로드에 실패했습니다.";
      alert(message);
      console.error("❌ Image upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // src/pages/mypage/EditProfile.jsx
  // validateForm 함수 추가
  const validateForm = () => {
    const errors = {};

    if (!form.nickname?.trim()) {
      errors.nickname = "닉네임을 입력해주세요.";
    }

    if (form.height && (form.height < 100 || form.height > 250)) {
      errors.height = "키는 100cm ~ 250cm 사이로 입력해주세요.";
    }

    if (form.weight && (form.weight < 30 || form.weight > 200)) {
      errors.weight = "몸무게는 30kg ~ 200kg 사이로 입력해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      console.error("폼 검증 에러:", errors);
      alert(Object.values(errors)[0]); // 첫 번째 에러 메시지 표시
      return false;
    }

    return true;
  };

  // src/pages/mypage/EditProfile.jsx의 handleSubmit 함수 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 검증 - form.nickname 대신 form.name 사용
    if (!form.name?.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const currentUser = loginState; // useSelector를 여기서 사용하지 말고 기존 loginState 사용

      const formData = {
        memberId: currentUser.memberId || 1, // memberId 추가
        nickname: form.name, // form.nickname 대신 form.name 사용
        birthAt: form.birthAt,
        gender: form.gender,
        height: form.height ? parseFloat(form.height) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        activityLevel: form.activityLevel,
        // 백엔드 DTO에 필요한 추가 필드들
        email: currentUser.email || "",
        name: form.name, // 이것도 form.name 사용
        profileImageUrl: currentUser.profileImageUrl || null,
      };

      console.log("📤 전송할 데이터:", formData);

      // 빈 문자열이나 undefined 값 제거
      Object.keys(formData).forEach((key) => {
        if (formData[key] === "" || formData[key] === undefined) {
          delete formData[key];
        }
      });

      console.log("Submitting profile data:", formData);

      const response = await updateProfile(formData);
      dispatch(editProfile(response));
      alert("프로필이 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("Profile update error details:", error.response?.data);
      const message =
        error.response?.data?.message || "프로필 수정에 실패했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4">
      <SubLayout to="/mypage" menu="마이페이지" label="프로필 수정" />

      {/* 안내 섹션 */}
      <div className="mt-8 bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-100 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="font-bold text-gray-900 text-lg">프로필 수정하기</h2>
        </div>
        <p className="text-purple-700 text-sm">
          변경된 정보에 따라 목표 칼로리가 자동으로 재계산됩니다.
        </p>

        {/* <div className="w-full max-w-[1020px] mx-auto px-4">
      <SubLayout to="/mypage" menu="마이페이지" label="프로필 수정" />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <ProfileImage
              currentImage={form.photo}
              onImageChange={handlePhotoChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <FormInput
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <FormInput
                name="birthAt"
                type="date"
                value={form.birthAt}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <FormSelect
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { value: "FEMALE", label: "여성" },
                  { value: "MALE", label: "남성" },
                ]}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                키 (cm)
              </label>
              <FormInput
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                몸무게 (kg)
              </label>
              <FormInput
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                활동량
              </label>
              <FormSelect
                name="activityLevel"
                value={form.activityLevel}
                onChange={handleChange}
                options={[
                  { value: "HIGH", label: "매우 활동적" },
                  { value: "MEDIUM", label: "활동적" },
                  { value: "LOW", label: "낮음" },
                ]}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/mypage")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form> */}
      </div>

      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              닉네임
            </label>
            <FormInput
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              생년월일
            </label>
            <FormInput
              name="birthAt"
              type="date"
              value={form.birthAt}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              성별
            </label>
            <FormSelect
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "FEMALE", label: "여성" },
                { value: "MALE", label: "남성" },
              ]}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              활동 수준
            </label>
            <FormSelect
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              options={[
                { value: "LOW", label: "조금 활동적" },
                { value: "MODERATE", label: "활동적" },
                { value: "HIGH", label: "매우 활동적" },
              ]}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              키 (cm)
            </label>
            <FormInput
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="키를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              몸무게 (kg)
            </label>
            <FormInput
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="몸무게를 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            저장하기
          </button>

          <button
            type="button"
            onClick={() => navigate("/mypage")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

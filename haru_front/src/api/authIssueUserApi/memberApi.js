import axios from "./axiosInstance";
import { getCookie } from "../../utils/cookieUtils";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api";

// axios 기본 설정
const axiosConfig = {
  // withCredentials는 axiosInstance에서 이미 설정됨
};

// 회원 가입 (JSON 형태)
export const signupMember = async (memberData) => {
  console.log("🔍 회원가입 API 호출:", `${API_BASE_URL}/members/signup`);
  console.log("🔍 회원가입 데이터:", memberData);

  return axios.post(`${API_BASE_URL}/members/signup`, memberData, {
    headers: { "Content-Type": "application/json" },
    ...axiosConfig,
  });
};

// 로그인 (cookie-based)
export const loginMember = async (loginParam) => {
  const header = {
    headers: {
      "Content-Type": "x-www-form-urlencoded",
    },
  };

  const formData = new FormData();
  formData.append("nickname", loginParam.nickname);
  formData.append("password", loginParam.password);

  const response = await axios.post(
    API_BASE_URL + "/members/login",
    formData,
    header
  );

  // 출력이 안되므로 아래 코드로 변경
  // console.log(API_BASE_URL);

  return response;
};

// 로그아웃 (cookie-based)
export const logoutMember = async () => {
  try {
    console.log("📡 Calling backend logout endpoint...");
    const response = await axios.post(
      `${API_BASE_URL}/logout`,
      {},
      axiosConfig
    );
    console.log("✅ Backend logout response:", response.status);
    return response;
  } catch (error) {
    console.error(
      "❌ Backend logout error:",
      error.response?.status,
      error.response?.data
    );
    // Don't throw the error - let the frontend continue with logout
    // The backend might not have a logout endpoint yet
    return null;
  }
};

// 현재 로그인된 사용자 정보 가져오기
// export const fetchCurrentMember = async () => {
//   const res = await axios.get(`${API_BASE_URL}/me`, axiosConfig);
//   return res.data;
// };

// 🔥 Redux에서 토큰 가져오기 위한 import 추가
// import store from "../../store/store"; // 🔥 올바른 경로로 수정 (default import)

// 프로필 이미지 변경 - 기존 정상 작동하는 엔드포인트 활용
export const updatePhoto = async (photoUrl) => {
  try {
    console.log(
      "🔥 프로필 이미지 URL 업데이트 (기존 엔드포인트 활용):",
      photoUrl
    );

    // 🔥 정상 작동하는 /me 엔드포인트 사용
    const response = await axios.put(`${API_BASE_URL}/members/me`, {
      profileImageUrl: photoUrl, // DTO 필드명에 맞춤
    });

    console.log("✅ 프로필 이미지 업데이트 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 프로필 이미지 업데이트 실패:", error);
    throw error;
  }
};

// 회원 탈퇴 (내 계정)
export const deleteAccount = async () => {
  console.log("🔍 회원 탈퇴 API 호출:", `${API_BASE_URL}/me`);
  return axios
    .delete(`${API_BASE_URL}/me`, axiosConfig)
    .then((res) => res.data);
};

// 이메일 중복 확인
export const checkEmailExists = async (email) => {
  console.log(
    "🔍 이메일 중복체크 API 호출:",
    `${API_BASE_URL}/members/check-email?email=${email}`
  );

  try {
    const response = await axios.get(`${API_BASE_URL}/members/check-email`, {
      params: { email },
      ...axiosConfig,
    });

    console.log("✅ 이메일 중복체크 응답:", response.data);
    return response;
  } catch (error) {
    console.error("❌ 이메일 중복체크 실패:", error);
    console.error(
      "❌ 요청 URL:",
      `${API_BASE_URL}/members/check-email?email=${email}`
    );
    throw error;
  }
};

// 닉네임 중복 확인
export const checkNicknameExists = async (nickname) => {
  console.log(
    "🔍 닉네임 중복체크 API 호출:",
    `${API_BASE_URL}/members/check-nickname?nickname=${nickname}`
  );

  try {
    const response = await axios.get(`${API_BASE_URL}/members/check-nickname`, {
      params: { nickname },
      ...axiosConfig,
    });

    console.log("✅ 닉네임 중복체크 응답:", response.data);
    return response;
  } catch (error) {
    console.error("❌ 닉네임 중복체크 실패:", error);
    console.error(
      "❌ 요청 URL:",
      `${API_BASE_URL}/members/check-nickname?nickname=${nickname}`
    );
    throw error;
  }
};

// 닉네임 찾기 (이름+이메일)
export const searchNickname = async (form) => {
  console.log(
    "🔍 닉네임 찾기 API 호출:",
    `${API_BASE_URL}/members/find-nickname`
  );
  return axios.post(`${API_BASE_URL}/members/find-nickname`, form, axiosConfig);
};

// 비밀번호 재설정 요청
export const requestPasswordReset = async ({ name, email }) => {
  console.log(
    "🔍 비밀번호 재설정 API 호출:",
    `${API_BASE_URL}/members/reset-password`
  );
  return axios.post(
    `${API_BASE_URL}/members/reset-password`,
    { name, email },
    axiosConfig
  );
};

// 프로필 정보 수정 (general profile update without image)
export const updateProfile = async (userData) => {
  try {
    console.log("받은 userData:", userData);

    if (!userData || !userData.memberId) {
      console.error("memberId 누락:", userData);
      throw new Error("사용자 ID가 필요합니다.");
    }

    // PUT 요청으로 프로필 업데이트
    const response = await axios.put(
      `${API_BASE_URL}/members/${userData.memberId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("프로필 업데이트 에러:", error);
    if (error.response) {
      console.error("서버 에러 응답:", error.response.data);
    }
    throw error;
  }
};

// 회원 정보 수정 (multipart: data + profileImage)
export const updateMemberWithImage = async (id, memberData, profileImage) => {
  console.log("Profile update with image requested:", {
    id,
    memberData,
    hasImage: !!profileImage,
  });

  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(memberData)], { type: "application/json" })
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  try {
    // Use axios (which is your configured axiosInstance)
    const response = await axios.put(
      `${API_BASE_URL}/members/${id}/multipart`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...axiosConfig,
      }
    );

    console.log("✅ Profile update with image successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Profile update with image error:", error);

    if (error.response?.status === 401) {
      alert("인증이 필요합니다. 다시 로그인해주세요.");
    } else if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    } else if (error.response?.status === 404) {
      alert("회원을 찾을 수 없습니다.");
    } else {
      const message =
        error.response?.data?.message || "프로필 수정에 실패했습니다.";
      alert(message);
    }

    throw error;
  }
};

// getCurrentUser 함수 추가 및 export
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("현재 사용자 정보 조회 실패:", error);
    throw error;
  }
};

// 기타 필요한 멤버 관련 API 함수들
export const getMemberProfile = async (memberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("멤버 프로필 조회 실패:", error);
    throw error;
  }
};

// memberApi 객체로 묶어서 default export
const memberApi = {
  getCurrentUser,
  updateProfile,
};

export default memberApi;

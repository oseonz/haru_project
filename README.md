# README

# 하루칼로리
<hr>
## 🎯 프로젝트 소개

🏷️ 프로젝트명: 하루칼로리

🗓️ 프로젝트 기간: 2025.06.16 ~ 2025.08.04 (6주)

👥 구성원: 안소라(팀장/Front, Back), 고인헌(팀원/Front, Back), 문연순(팀원/Front, Back), 이서진(팀원/Front, Back)

## 📝 기획 배경

기존의 식단 기록 앱들은 대부분 수동 입력 방식에 의존하고 있어, 사용자가 일일이 음식명을 검색하고 칼로리 및 영양 정보를 입력해야 하는 번거로움이 있습니다.
이로 인해 사용자의 피로도가 높고, 지속적인 사용이 어려운 경우가 많습니다.
또한 정보의 정확성이나 활용성 측면에서도 부족함이 존재해, 건강한 식습관 형성에 효과적으로 기여하지 못하는 한계가 있습니다.
하루칼로리는 AI를 활용한 자동 식단 기록 기능을 통해 사용자의 입력 부담을 최소화하고자 합니다.
사용자는 단순히 식사 사진을 업로드하는 것만으로도 AI가 자동으로 음식을 인식하고 칼로리 및 영양 정보를 분석하여 기록해줍니다.
또한 맞춤형 리포트와 피드백을 통해 사용자가 건강한 식습관을 자연스럽게 만들 수 있도록 돕습니다.

## 📝 서비스 소개

사진 한 장으로 끝내는 식단 기록, 하루칼로리

하루칼로리는 사용자의 식사 사진을 AI가 자동 분석하여, 음식 종류부터 칼로리·영양소까지 빠르고 정확하게 기록해주는 AI 기반 식단 관리 서비스입니다.
복잡한 검색 없이, 사진만 업로드하면 매일의 식습관을 쉽게 추적하고 맞춤형 리포트와 챗봇, 커뮤니티 기능을 통해 건강한 루틴 형성을 지원합니다.

이미지 기반 식단 자동 인식 및 분석: 사용자가 식사 내용을 일일이 입력하지 않아도, 사진을 업로드하면 AI가 자동으로 식단을 인식하고 분석합니다.
사진 속 음식 종류와 양을 분석해 칼로리와 주요 영양소(탄수화물, 단백질, 지방 등)를 계산하며, 이 과정은 빠르고 정확하게 진행됩니다.
AI 건강 상담 챗봇 (ChatGPT 기반): AI 기반 건강 상담 챗봇이 탑재되어 있어, 언제든지 건강 관련 궁금증을 자연스럽게 대화하듯 해결할 수 있습니다.
식습관, 영양, 운동, 체중 관리 등 다양한 주제에 대해 실시간으로 상담을 제공하며, 단순한 지식 전달을 넘어 사용자의 식단 데이터와 연계해 개인 맞춤형 답변을 제공합니다.

## 👤 서비스 대상

- 다이어트, 식습관 개선, 건강 관리를 시작하려는 사람
- 식단 기록을 해보려 했지만 매번 입력이 귀찮았던 사람
- 식사 데이터를 시각적으로 보고 인사이트를 얻고 싶은 사람

## 🏠 서비스 화면 및 기능 소개

## ⚒️ 기술 스택

### Frontend

React, Node.js, Redux, Redux-Toolkit, daisyUI, AXIOS, tailwindcss

### Backend

spring boot, spring security, MySQL, lombok, Gradle, Java, python, Apache Tomcat

### ETC

### Communication

Discord, Notion, git, GitHub

## 📂프로젝트 구조

<hr>

- ### Frontend - React

  📁 src
  ├── 📁 api
  ├── 📁 assets
  ├── 📁 components
  │ ├── 📁 chatbot
  │ ├── 📁 common
  │ ├── 📁 community
  │ ├── 📁 haruReport
  │ ├── 📁 meal
  │ ├── 📁 mypage
  ├── 📁 hooks
  ├── 📁 layout
  ├── 📁 pages
  │ ├── 📁 community
  │ ├── 📁 haruReport
  │ ├── 📁 meal
  │ ├── 📁 member
  │ ├── 📁 mypage
  │ ├── 📁 welcome
  ├── 📁 routers
  ├── 📁 slices
  ├── 📁 store
  └── 📁 utils

- ### Backend - Springboot

  📁 java
  └── 📁 com
  └── 📁 study
  └── 📁 spring
  ├── 📁 domain
  │ ├── 📁 board
  │ │ ├── 📁 controller
  │ │ ├── 📁 dto
  │ │ ├── 📁 entity
  │ │ ├── 📁 repository
  │ │ └── 📁 service
  │ ├── 📁 issue
  │ │ ├── 📁 controller
  │ │ ├── 📁 dto
  │ │ ├── 📁 entity
  │ │ ├── 📁 repository
  │ │ └── 📁 service
  │ ├── 📁 meal
  │ │ ├── 📁 controller
  │ │ ├── 📁 dto
  │ │ ├── 📁 entity
  │ │ ├── 📁 repository
  │ │ └── 📁 service
  │ └── 📁 member
  │ ├── 📁 controller
  │ ├── 📁 dto
  │ ├── 📁 entity
  │ ├── 📁 repository
  │ ├── 📁 service
  │ └── 📁 util
  ├── 📁 security
  ├── 📄 HarukcalApplication.java
  ├── 📄 ServletInitializer.java
  └── 📁 resources

- ### Backend - FastAPI
  📁 chatbot  
  ├── 📄 **init**.py  
  ├── 📄 cookie_utils.py  
  ├── 📄 knowledge_base.py  
  ├── 📄 models.py  
  ├── 📄 question_processor.py  
  └── 📄 utils.py

📁 issues  
├── 📁 app  
│ ├── 📄 **init**.py  
│ ├── 📄 crawler.py  
│ ├── 📄 db.py  
│ └── 📄 issuesMain.py

📁 meals  
├── 📄 **init**.py  
└── 📄 imagetest.py

📁 routers  
├── 📄 **init**.py  
├── 📄 chatbot.py  
├── 📄 image.py  
└── 📄 system.py

📄 .gitignore  
📄 main_backup.py  
📄 main_new.py  
📄 test_langchain.py

<hr>

# 📜 프로젝트 산출물

### 💥 아키텍쳐

### ERD

!(haru_front/src/assets/img/ERD.png)

### API 명세서

- FastAPI
  !(haru_front/src/assets/img/API(1).png)
  !(haru_front/src/assets/img/API(2).png)

# 정산내역 관리 시스템

React + NestJS + TypeScript + PostgreSQL 기반의 정산내역 관리 웹 애플리케이션입니다.

## 주요 기능

- ✅ JWT 기반 사용자 인증
- ✅ 정산내역 조회 및 검색
- ✅ CSV 파일 업로드를 통한 데이터 일괄 등록
- ✅ 반응형 대시보드 UI
- ✅ 페이지네이션 및 정렬 기능
- ✅ Docker를 통한 간편한 배포

## 기술 스택

### 백엔드
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **File Upload**: Multer
- **CSV Parsing**: csv-parser

### 프론트엔드
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Ant Design
- **Styling**: Styled Components
- **HTTP Client**: Axios
- **Routing**: React Router

### 인프라
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Database**: PostgreSQL 15

## 프로젝트 구조

```
settlement-management/
├── backend/                 # NestJS 백엔드
│   ├── src/
│   │   ├── auth/           # 인증 모듈
│   │   ├── settlement/     # 정산내역 모듈
│   │   ├── upload/         # 파일 업로드 모듈
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── contexts/       # Context API
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml      # Docker Compose 설정
├── init.sql               # 데이터베이스 초기화
└── README.md
```

## 시작하기

### 사전 요구사항
- Docker & Docker Compose
- Node.js 18+ (로컬 개발 시)

### Docker를 이용한 실행

1. **프로젝트 클론**
```bash
git clone <repository-url>
cd settlement-management
```

2. **Docker Compose로 전체 애플리케이션 실행**
```bash
docker-compose up --build
```

3. **애플리케이션 접속**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001

### 로컬 개발 환경 설정

#### 백엔드 설정
```bash
cd backend
npm install
npm run start:dev
```

#### 프론트엔드 설정
```bash
cd frontend
npm install
npm start
```

#### 데이터베이스 설정
PostgreSQL이 로컬에 설치되어 있어야 합니다.
```sql
CREATE DATABASE settlement_db;
-- 백엔드 실행 시 자동으로 테이블이 생성됩니다 (synchronize: true)
```

## 사용 방법

### 1. 로그인
- **테스트 계정**: 
  - ID: `admin`
  - PW: `admin123`

### 2. 정산내역 조회
- 메인 대시보드에서 정산내역 목록을 확인할 수 있습니다
- 검색 기능으로 특정 월이나 비고 내용으로 필터링 가능
- 페이지네이션으로 대량의 데이터를 효율적으로 탐색

### 3. CSV 업로드
- "CSV 업로드" 버튼을 클릭하여 정산 데이터를 일괄 등록
- CSV 파일 형식:
```csv
정산 월,업체수,인원수,청구금액,수수료,입금일자,정산 수수료,비고,금액,정산일자
2024-03,2,3,7899500,492560,2024-04-10,123140,정산일자,123140,2024-02-29
```

## API 문서

### 인증 API
- `POST /auth/login` - 로그인
- `GET /auth/profile` - 사용자 프로필 조회

### 정산내역 API
- `GET /settlements` - 정산내역 목록 조회
- `POST /settlements` - 정산내역 생성
- `GET /settlements/:id` - 특정 정산내역 조회
- `DELETE /settlements/:id` - 정산내역 삭제

### 업로드 API
- `POST /upload/csv` - CSV 파일 업로드

## 환경 변수

### 백엔드 (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=settlement_db
JWT_SECRET=your-secret-key
```

## 개발 참고사항

### 데이터베이스 스키마

#### users 테이블
- id (PK)
- username (unique)
- password (bcrypt 해시)
- name
- isActive
- created_at, updated_at

#### settlements 테이블
- id (PK)
- settlement_month (정산 월)
- company_count (업체수)
- employee_count (인원수)
- billing_amount (청구금액)
- commission (수수료)
- deposit_date (입금일자)
- settlement_commission (정산 수수료)
- note (비고)
- amount (금액)
- settlement_date (정산일자)
- created_at, updated_at

### 테스트 데이터
초기 데이터베이스 설정 시 테스트용 사용자와 샘플 정산 데이터가 자동으로 생성됩니다.

## 라이센스
MIT License

## 기여하기
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 
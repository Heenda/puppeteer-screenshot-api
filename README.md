# Vercel Puppeteer Screenshot API 배포 가이드

## 🎯 완전 무료 솔루션

이 API를 사용하면 HCTI 없이 완전 무료로 Puppeteer 스크린샷을 사용할 수 있습니다!

---

## ✅ Vercel 무료 한도

```
✅ 월 100GB-hours (넉넉함)
✅ 월 100만 요청
✅ 이 워크플로우: 월 20회 사용
✅ 신용카드 불필요 (Hobby 플랜)
✅ 회사 계정과 완전 분리
```

---

## 📦 준비물

1. **개인 GitHub 계정** (무료)
2. **Vercel 계정** (무료 - GitHub로 가입)
3. **Git 설치** (로컬)

---

## 🚀 배포 방법 (10분)

### Step 1: GitHub 저장소 생성

1. **GitHub 로그인** (개인 계정)
2. **New Repository** 클릭
3. 저장소 이름: `puppeteer-screenshot-api`
4. **Public** 선택 (무료)
5. **Create repository**

---

### Step 2: 코드 업로드

**터미널 / Git Bash에서:**

```bash
# 1. 작업 폴더 생성
mkdir puppeteer-screenshot-api
cd puppeteer-screenshot-api

# 2. Git 초기화
git init

# 3. 폴더 구조 생성
mkdir api

# 4. 파일 생성 (아래 내용 복사)
# - api/screenshot.js
# - package.json
# - vercel.json
# - .gitignore

# 5. Git에 추가
git add .
git commit -m "Initial commit"

# 6. GitHub 연결 (본인 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/puppeteer-screenshot-api.git
git branch -M main
git push -u origin main
```

**또는 GitHub Desktop 사용:**
1. GitHub Desktop 열기
2. File → New Repository
3. 이름: `puppeteer-screenshot-api`
4. 폴더에 파일들 복사
5. Commit & Push

---

### Step 3: Vercel 배포

1. **Vercel 가입**
   - https://vercel.com 접속
   - "Sign Up" 클릭
   - **"Continue with GitHub"** 선택 (개인 GitHub 계정)
   - Hobby (Free) 플랜 선택

2. **프로젝트 Import**
   - Dashboard → "Add New..." → "Project"
   - GitHub 저장소에서 `puppeteer-screenshot-api` 선택
   - **Import** 클릭

3. **설정 확인**
   - Framework Preset: **Other** (자동 감지됨)
   - Root Directory: `.` (기본값)
   - Build Command: (비워둠)
   - Output Directory: (비워둠)

4. **Deploy 클릭!**
   - 약 2-3분 소요
   - 성공하면 URL 생성: `https://puppeteer-screenshot-api-xxx.vercel.app`

---

## 🧪 API 테스트

배포 완료 후 테스트:

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1 style=\"font-size:100px;\">Hello World!</h1></body></html>",
    "viewport_width": 1920,
    "viewport_height": 1080,
    "device_scale": 2
  }'
```

**성공 응답:**
```json
{
  "success": true,
  "image": "iVBORw0KGgoAAAANS...(base64 이미지)",
  "mimeType": "image/png",
  "width": 1920,
  "height": 1080
}
```

---

## 🔗 n8n에서 사용하기

### 기존 워크플로우 수정

**노드: "Convert to Screenshot (HCTI)"**

**Before (HCTI):**
```
URL: https://hcti.io/v1/image
Authentication: HTTP Basic Auth
```

**After (Vercel):**
```
URL: https://YOUR-PROJECT.vercel.app/api/screenshot
Authentication: None (인증 불필요)
```

**Request Body:**
```json
{
  "html": "{{ $json.html }}",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "device_scale": 2
}
```

**응답 처리:**
기존 `$json.url` → `$json.image` (base64)로 변경

---

## 📝 n8n 워크플로우 수정 필요 부분

### 1. "Convert to Screenshot" 노드
```javascript
// URL 변경
"url": "https://YOUR-PROJECT.vercel.app/api/screenshot"

// Authentication 제거 (None)

// Response 처리
// HCTI는 이미지 URL 반환 → 다운로드 필요
// Vercel은 base64 직접 반환 → 바로 사용
```

### 2. "Download Screenshot" 노드 수정
**Before (HCTI):**
```javascript
// URL에서 이미지 다운로드
url: "={{ $json.url }}"
```

**After (Vercel):**
```javascript
// Base64를 바이너리로 변환
const base64Data = $json.image;
const binaryData = Buffer.from(base64Data, 'base64');

return [{
  json: {},
  binary: {
    data: binaryData,
    mimeType: 'image/png'
  }
}];
```

---

## 🎨 수정된 워크플로우 JSON

제가 수정된 버전을 만들어드릴게요!

---

## 💡 Vercel 대시보드 확인

**배포 후 확인할 것:**

1. **Functions Tab**
   - 호출 횟수 확인
   - 에러 로그 확인

2. **Analytics**
   - 무료 한도 사용량 확인

3. **Settings → Environment Variables**
   - 추가 설정 없음 (기본값 사용)

---

## 🔧 트러블슈팅

### "Function execution timed out"
**원인:** HTML이 너무 복잡하거나 이미지가 많음
**해결:**
- vercel.json에서 `maxDuration: 30` → `60`으로 변경
- HTML 간소화

### "Memory limit exceeded"
**원인:** 고해상도 스크린샷
**해결:**
- `device_scale: 2` → `1`로 변경
- 또는 vercel.json에서 memory 증가

### GitHub 연결 안됨
**해결:**
- GitHub 저장소가 Public인지 확인
- Vercel에서 GitHub 권한 재승인

---

## 📊 비용 (완전 무료!)

| 항목 | 무료 한도 | 사용량 | 상태 |
|------|-----------|--------|------|
| Function 실행 | 100GB-hours | ~0.1GB-hours | ✅ 0.1% |
| Bandwidth | 100GB | ~10MB | ✅ 0.01% |
| 빌드 시간 | 6,000분 | 0분 (serverless) | ✅ |

**→ 완전 무료로 평생 사용 가능!**

---

## 🔒 보안

### API 키 추가하려면 (선택사항)

**api/screenshot.js에 추가:**
```javascript
// 간단한 API 키 인증
const API_KEY = process.env.API_KEY || 'your-secret-key';

if (req.headers['x-api-key'] !== API_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Vercel 환경변수 설정:**
1. Settings → Environment Variables
2. `API_KEY` = `your-secret-key-123`
3. Redeploy

---

## 🎯 다음 단계

1. ✅ Vercel 배포 완료
2. ✅ API 테스트 성공
3. ⬜ n8n 워크플로우 수정 (제가 만들어드릴게요!)
4. ⬜ 전체 테스트

---

## 📞 문의

- 배포 중 에러 발생 시 스크린샷 보내주세요
- Vercel URL 알려주시면 테스트 도와드릴게요!

준비됐으면 배포 시작하세요! 🚀

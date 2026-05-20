# Results

## 1. 실험 요약
- 저장소: shared-webgpu-capability
- 커밋 해시: bf4fa1e
- 실험 일시: 2026-05-20T15:47:21.217Z -> 2026-05-20T15:47:21.217Z
- 담당자: ai-webgpu-lab
- 실험 유형: `infra`
- 상태: `success`

## 2. 질문
- shared 공통 helper로 WebGPU capability와 baseline 결과를 같은 스키마로 만들어 낼 수 있는가
- feature/limit count와 capability coverage가 결과 문서에 그대로 남는가
- consumer 저장소가 이 helper를 갖다 쓰기 전에 deterministic baseline harness로 계약을 검증할 수 있는가

## 3. 실행 환경
### 브라우저
- 이름: Chrome
- 버전: 147.0.7727.15

### 운영체제
- OS: Linux
- 버전: unknown

### 디바이스
- 장치명: Linux x86_64
- device class: `desktop-high`
- CPU: 16 threads
- 메모리: 32 GB
- 전원 상태: `unknown`

### GPU / 실행 모드
- adapter: WebGPU adapter
- backend: `webgpu`
- fallback triggered: `false`
- worker mode: `main`
- cache state: `warm`
- required features: ["core-features-and-limits"]
- limits snapshot: {"maxTextureDimension1D":8192,"maxTextureDimension2D":8192,"maxTextureDimension3D":2048,"maxBindGroups":4,"maxBindingsPerBindGroup":1000,"maxUniformBufferBindingSize":65536,"maxStorageBufferBindingSize":134217728,"maxComputeInvocationsPerWorkgroup":256,"maxComputeWorkgroupStorageSize":16384,"maxBufferSize":268435456}

## 4. 워크로드 정의
- 시나리오 이름: shared-webgpu-capability Probe
- 입력 프로필: webgpu-capable
- 데이터 크기: adapter=WebGPU adapter; features=1; limits=10/10; automation=playwright-chromium
- dataset: shared-webgpu-capability-v1
- model_id 또는 renderer: WebGPU adapter
- 양자화/정밀도: -
- resolution: -
- context_tokens: -
- output_tokens: -

## 5. 측정 지표
### 공통
- time_to_interactive_ms: 199.4 ms
- init_ms: 4.2 ms
- success_rate: 1
- peak_memory_note: 32 GB reported by browser
- error_type: -

### Org / Infra
- baseline_readiness_score: 98
- helper_function_count: 7
- capability_features_count: 1
- capability_limit_count: 10
- capability_limit_coverage_pct: 100 %
- validated_field_count: 16
- backends: webgpu
- fallback states: false

## 6. 결과 표
| Run | Scenario | Backend | Cache | Mean | P95 | Notes |
|---|---|---:|---:|---:|---:|---|
| 1 | shared-webgpu-capability Probe | webgpu | warm | 98 | 100 | helpers=7, features=1, limits=10, fallback=false |

## 7. 관찰
- playwright-chromium로 수집된 automation baseline이며 headless=true, browser=Chromium 147.0.7727.15.
- 실제 runtime/model/renderer 교체 전 deterministic harness 결과이므로, 절대 성능보다 보고 경로와 재현성 확인에 우선 의미가 있다.

## 8. 결론
- 첫 raw result와 summary 문서가 연결됐다.
- 다음 단계는 deterministic harness를 실제 workload로 교체하는 것이다.
- 브라우저와 cache-state 반복 측정이 더 필요하다.

## 9. 첨부
- 스크린샷: ./reports/screenshots/01-shared-webgpu-capability-baseline.png
- 로그 파일: ./reports/logs/01-shared-webgpu-capability-baseline.log
- raw json: ./reports/raw/01-shared-webgpu-capability-baseline.json
- 배포 URL: https://ai-webgpu-lab.github.io/shared-webgpu-capability/
- 관련 이슈/PR: -

# shared-webgpu-capability

`capability 수집 유틸`를 담당하는 공통 인프라 저장소입니다. 여러 실험/벤치/앱 저장소에서 반복될 코드를 별도 모듈로 분리하고, 조직 차원의 재사용 지점을 명확하게 관리하는 것이 목적입니다.

## 저장소 역할
- 개별 프로젝트에 흩어지면 유지비가 커지는 공통 유틸리티와 운영 자산을 분리합니다.
- 소비자 저장소가 어떤 함수, 워크플로우, 규칙을 기대할 수 있는지 명시적인 계약을 제공합니다.
- 실험 저장소의 속도를 해치지 않도록 안정화된 공통 조각만 수용합니다.

## 우선순위
- P0

## 기본 구조
- `src/` - 재사용 가능한 모듈 또는 스크립트 구현
- `docs/` - 사용법, 설계 메모, 소비자 통합 가이드

## 조직 상태 대시보드
- 전체 Pages/demo 상태는 `docs-lab-roadmap/docs/PAGES-STATUS.md`에서 확인합니다.
- 이 저장소의 live demo는 `https://ai-webgpu-lab.github.io/shared-webgpu-capability/`에서 확인합니다.
- 통합 sketch/adapter 상태는 `docs-lab-roadmap/docs/INTEGRATION-STATUS.md`에서 확인합니다.
- sketch capabilities는 `docs-lab-roadmap/docs/SKETCH-METRICS.md`에서 확인합니다.

## 운영 규칙
- 공통화 후보는 둘 이상의 저장소에서 반복 사용되는 경우에만 승격합니다.
- 공개 API나 워크플로우 입력/출력은 README와 `docs/`에 함께 문서화합니다.
- 실험 중인 아이디어는 개별 저장소에서 검증한 뒤 안정화 후 이곳으로 이동합니다.

## 완료 기준
- 소비자 저장소가 따라 할 수 있는 최소 사용 예시가 README 또는 `docs/`에 있습니다.
- 변경 시 영향을 받는 저장소 범위를 설명할 수 있습니다.
- 저장소 목적과 무관한 도메인별 로직이 유입되지 않습니다.

## 관련 저장소
- `docs-lab-roadmap` - 어떤 공통 자산이 필요한지 결정하는 계획 기준
- `shared-bench-schema` - 결과 리포팅 공통 자산
- `tpl-webgpu-vanilla`, `tpl-webgpu-react` - 공통 자산을 가장 먼저 반영할 템플릿 저장소

## 라이선스
MIT

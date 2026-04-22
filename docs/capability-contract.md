# Capability Contract

`shared-webgpu-capability`는 브라우저 환경에서 WebGPU readiness를 캡처하고, 공통 결과 스키마와 맞는 baseline JSON 초안을 만드는 최소 유틸리티를 제공한다.

## Exported APIs
- `baseEnvironmentSnapshot()` - 브라우저/OS/디바이스 기본 스냅샷 생성
- `collectWebGpuCapability()` - adapter/device 요청 후 GPU capability 캡처
- `buildBaselineResult(options, capability)` - 공통 스키마에 맞춘 baseline 결과 초안 생성

## Intended Usage
1. 실험/벤치/앱 저장소에서 첫 baseline probe 시 environment snapshot을 캡처한다.
2. workload-specific KPI가 아직 없더라도 공통 메타데이터와 fallback 상태를 먼저 기록한다.
3. 이후 각 저장소에서 모델, 렌더러, 런타임별 세부 metric을 추가한다.

## Non-goals
- 저장소별 KPI 계산 로직 제공
- 브라우저별 완벽한 user agent 판별
- build tooling이나 framework integration 자동화

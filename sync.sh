#!/usr/bin/env bash
# ============================================================================
# 벙커마켓 동기화 (sync)
#   1) 로컬 변경 커밋  →  2) 원격 최신 반영(pull --rebase)  →  3) 올리기(push)
# 사용법:  sync            (자동 메시지)
#          sync "메모마켓 문구 수정"   (직접 메시지)
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:-sync $(date '+%Y-%m-%d %H:%M')}"
echo "🌊 벙커마켓 동기화  ·  $(pwd)"

# 1) 로컬 변경 있으면 커밋
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -q -m "$MSG"
  echo "  ✅ 커밋됨: $MSG"
else
  echo "  ℹ️ 로컬 변경 없음"
fi

# 2) 원격 최신 받아오기 (충돌 시 중단하고 안내)
echo "  ⬇️  원격에서 가져오는 중…"
if ! git pull --rebase --autostash; then
  echo ""
  echo "  ⚠️  충돌이 있어요. 파일을 정리한 뒤 다시 'sync' 하세요."
  echo "     (되돌리려면:  git rebase --abort )"
  exit 1
fi

# 3) 올리기
echo "  ⬆️  올리는 중…"
git push -q
echo "✅ 동기화 완료 — 두 맥이 같아졌습니다."

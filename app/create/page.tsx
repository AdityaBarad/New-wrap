import { WrapFlow } from "@/components/stages/wrap-flow"
import { ComingSoon } from "@/components/wrapped/coming-soon"

export default function CreatePage() {
  if (process.env.SHOW_COMING_SOON === 'true') {
    return <ComingSoon />
  }

  return <WrapFlow />
}

import StaticContentScreen from "../components/StaticContentScreen"
import { TermsLocal } from "../constants/Locales"

const Terms = () => {
    return <StaticContentScreen title={TermsLocal['ar'].title} content={TermsLocal['ar'].content} />
}

export default Terms
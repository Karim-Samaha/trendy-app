import { useContext } from "react"
import StaticContentScreen from "../components/StaticContentScreen"
import { TermsLocal } from "../constants/Locales"
import { LanguageContext } from "../context/langContext"

const Terms = () => {
    const { lang } = useContext(LanguageContext)

    return <StaticContentScreen title={TermsLocal[lang].title} content={TermsLocal[lang].content} />
}

export default Terms
import { useContext } from "react"
import StaticContentScreen from "../components/StaticContentScreen"
import { RefundLocal } from "../constants/Locales"
import { LanguageContext } from "../context/langContext"

const RefundPolicy = () => {
    const { lang } = useContext(LanguageContext)

    return <StaticContentScreen title={RefundLocal[lang].title} content={RefundLocal[lang].content} />
}

export default RefundPolicy
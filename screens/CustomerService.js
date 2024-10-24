import { useContext } from "react"
import StaticContentScreen from "../components/StaticContentScreen"
import { CustomerServiceLocales } from "../constants/Locales"
import { LanguageContext } from "../context/langContext"

const CustomerService = () => {
    const { lang } = useContext(LanguageContext)

    return <StaticContentScreen title={CustomerServiceLocales[lang].title} content={CustomerServiceLocales[lang].content}
        linkUrlText={"WhatsApp"} linkUrl={"https://wa.me/+966539123890"} />
}

export default CustomerService
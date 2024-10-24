import { useContext } from "react"
import StaticContentScreen from "../components/StaticContentScreen"
import { LicenceLocal } from "../constants/Locales"
import { LanguageContext } from "../context/langContext"
const Licence = () => {
    const { lang } = useContext(LanguageContext)

    return <StaticContentScreen title={LicenceLocal[lang].title} content={LicenceLocal[lang].content}
     secContent={LicenceLocal[lang].subContent}/>
}

export default Licence
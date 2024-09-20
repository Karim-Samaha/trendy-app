import StaticContentScreen from "../components/StaticContentScreen"
import { CustomerServiceLocales } from "../constants/Locales"
const CustomerService = () => {
    return <StaticContentScreen title={CustomerServiceLocales['ar'].title} content={CustomerServiceLocales['ar'].content}
        linkUrlText={"WhatsApp"} linkUrl={"https://wa.me/+966539123890"} />
}

export default CustomerService
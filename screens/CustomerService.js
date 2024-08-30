import StaticContentScreen from "../components/StaticContentScreen"
import { CustomerServiceLocales } from "../constants/Locales"
const CustomerService = () => {
    return <StaticContentScreen title={CustomerServiceLocales['ar'].title} content={CustomerServiceLocales['ar'].content} />
}

export default CustomerService
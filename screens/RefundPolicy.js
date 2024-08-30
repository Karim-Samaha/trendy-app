import StaticContentScreen from "../components/StaticContentScreen"
import { RefundLocal } from "../constants/Locales"

const RefundPolicy = () => {
    return <StaticContentScreen title={RefundLocal['ar'].title} content={RefundLocal['ar'].content} />
}

export default RefundPolicy
import StaticContentScreen from "../components/StaticContentScreen"
import { LicenceLocal } from "../constants/Locales"
const Licence = () => {
    return <StaticContentScreen title={LicenceLocal['ar'].title} content={LicenceLocal['ar'].content}
     secContent={LicenceLocal['ar'].subContent}/>
}

export default Licence
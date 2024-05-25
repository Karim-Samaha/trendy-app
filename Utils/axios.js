import axios from 'axios'

const _axios = axios.create({
    baseURL: 'https://trendy-rose-ea018d58bf02.herokuapp.com/api',
})
_axios.interceptors.request.use(
    function (config) {
        let headers = {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
        if (config?.session?.user?.accessToken) {
            headers['Authorization'] = `Bearer ${config.session.user.accessToken}`
        }
        if (config?.userToken) {
            headers['Authorization'] = `Bearer ${config.session.user.accessToken}`
        }
        if (!config.data) {
            config.data = {}
        }
        config.headers = headers
        return config
    },
    function (error) {
        return Promise.reject()
    }
)
_axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error(`------Error Start-----`)
        console.log(error?.response?.config?.url)
        console.table(error?.response)
        console.log('------Error End-----')
        throw error
    }
)
export default _axios
import axios from 'axios'

const _axios = axios.create({
    baseURL: 'https://trendy-rose-ea018d58bf02.herokuapp.com/api',
})
_axios.interceptors.request.use(
    function (config) {
        console.log({config: config.parsedUser})
        let headers = {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
        if (config?.user?.accessToken) {
            headers['Authorization'] = `Bearer ${config.user.accessToken}`
        }
        if (config.parsedUser?.accessToken) {
            headers['Authorization'] = `Bearer ${config.parsedUser?.accessToken}`
        }
        if (!config.data) {
            config.data = {}
        }
        config.headers = headers
        console.log(config.headers)
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
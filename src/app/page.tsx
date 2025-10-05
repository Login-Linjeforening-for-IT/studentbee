import config from '@config'
import 'uibee/styles'
import { LoginPage } from 'uibee/components'

export default async function Page() {
    return (
        <LoginPage
            title='StudentBee'
            description=''
            redirectURL={config.auth.LOGIN_URL}
            version={config.version}
        />
    )
}

import config from '@config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginPage } from 'uibee/components'


export default async function Page() {
    const accessToken = (await cookies()).get('access_token')?.value
    if (accessToken) {
        redirect('/')
    }

    return (
        <LoginPage
            title='StudentBee'
            description=''
            redirectURL={config.auth.LOGIN_URL}
            version={config.version}
        />
    )
}

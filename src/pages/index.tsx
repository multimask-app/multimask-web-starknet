import { useNavigate } from 'react-router-dom'

export default function () {
  const nav = useNavigate()
  useEffect(() => {
    nav('/wallets')
  })

  return <div></div>
}

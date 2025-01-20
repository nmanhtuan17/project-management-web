import { LoadingSpinner } from "@/components/ui/loading-spinner"
import apiService from "@/services/api.service"
import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export const JoinProject = () => {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    apiService.post(`projects/${params.projectId}/members/join?code=${searchParams.get('code')}`).then(() => {
      navigate('/')
    })
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
import {Button} from "@/components/ui/button.tsx";
import NotFound from "@/assets/not-found.png";
import {useNavigate} from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <img className="w-[400px] h-[400px]" src={NotFound} alt="not-found"/>
      <Button onClick={() => navigate("/boarding")} className="gap-2">
        Back to boarding
      </Button>
    </div>
  )
}
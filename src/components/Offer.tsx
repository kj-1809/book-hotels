interface Props {
  title : string
}
import {BsFillXDiamondFill} from "react-icons/bs"

export const Offer: React.FC<Props> = ({title}) => {
  return (
    <div className="flex flex-row items-center p-1">
      <BsFillXDiamondFill />
      <h1 className="ml-4 font-semibold m-2">
        {title}
      </h1>
    </div>
  )
}
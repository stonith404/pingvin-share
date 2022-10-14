import { RingProgress } from "@mantine/core";
import { TbCircleCheck, TbCircleX } from "react-icons/tb";;

const UploadProgressIndicator = ({ progress }: { progress: number }) => {
  if (progress > 0 && progress < 100) {
    return (
      <RingProgress
        sections={[{ value: progress, color: "victoria" }]}
        thickness={3}
        size={25}
      />
    );
  } else if (progress == 100) {
    return <TbCircleCheck color="green" size={22} />;
  } else {
    return <TbCircleX color="red" size={22} />;
  }
};

export default UploadProgressIndicator;

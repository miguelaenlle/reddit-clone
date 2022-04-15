import LightButton from "./LightButton";

const DragAndDrop: React.FC<{
    dragText: string
}> = (props) => {
    return (
        <div className = "flex p-3 items-center space-x-3 border-dotted border-2 border-zinc-700 h-full">
            <p>{props.dragText}</p>
            
            <LightButton buttonText = "Upload" />
        </div>
    );
}
export default DragAndDrop
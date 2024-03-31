type Props = Readonly<{
  id: string;
  name: string;
}>;

export function WorkflowIcon(props: Props) {
  return (
    <img
      src={`/icons/${props.id}.png`}
      alt={`Logo of the workflow "${props.name}"`}
      className="w-full h-full"
    />
  );
}

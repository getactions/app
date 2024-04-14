type Props = Readonly<{
  id: string;
  title: string;
}>;

export function WorkflowLogo(props: Props) {
  return (
    <img
      src={`/logos/${props.id}.svg`}
      alt={`The logo of the '${props.title}' workflow`}
      className="w-full h-full"
    />
  );
}

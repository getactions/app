type Props = Readonly<{
  title: string;
  logo: string;
}>;

export function WorkflowLogo(props: Props) {
  return (
    <img
      src={`/logos/${props.logo}`}
      alt={`The logo of the "${props.title}" workflow`}
      className="w-full h-full"
    />
  );
}

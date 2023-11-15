export default function Page({ params }: { params: { id: string } }) {
  return <div>Id: {params.id}</div>;
}

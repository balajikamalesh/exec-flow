import db from "@/lib/db";

const Page = async () => {
  const xx = await db.user.findMany();
  
  return (
    <div>
      {JSON.stringify(xx)}
    </div>
  )
}

export default Page;
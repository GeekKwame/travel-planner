import { Outlet } from "react-router";
import RootNavbar from "../../../components/RootNavbar";
import { getUser } from "~/lib/auth";

export async function clientLoader() {
    try {
        const user = await getUser();
        return { user };
    } catch (e) {
        return { user: null };
    }
}

const PageLayout = ({ loaderData }: { loaderData?: { user?: any } }) => {
    return (
        <div className="bg-light-200">
            <RootNavbar user={loaderData?.user} />
            <Outlet />
        </div>
    )
}
export default PageLayout


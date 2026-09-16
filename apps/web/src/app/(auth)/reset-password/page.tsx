import { singleParam } from "@/lib/search-param";
import { ResetPasswordForm } from "./reset-password-form";

/**
 * Read on the server for the same reason as `/register`: a static page that
 * reads the query on the client fails the production build. When the form
 * sends someone to `?error=`, the navigation re-renders this with the new
 * value, so the expired screen still appears.
 */
export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { error, token } = await searchParams;
	return (
		<ResetPasswordForm
			linkError={singleParam(error)}
			token={singleParam(token)}
		/>
	);
}

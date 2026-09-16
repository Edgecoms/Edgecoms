import { singleParam } from "@/lib/search-param";
import { RegisterForm } from "./register-form";

/**
 * The invite token is read here, on the server, rather than with
 * `useSearchParams` in the form: a static page that reads the query on the
 * client fails the production build, and reading it here also puts the whole
 * form in the first HTML instead of after the script loads.
 */
export default async function RegisterPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { invite } = await searchParams;
	return <RegisterForm inviteToken={singleParam(invite)} />;
}

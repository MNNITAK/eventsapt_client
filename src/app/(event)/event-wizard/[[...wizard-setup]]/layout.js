export default async function Layout({ children,params,searchParams }) {
    const eventWizardURLData = await params
    
    return <>{children}
    
    </>;
}
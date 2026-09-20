import { cookies } from "next/headers";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { LandingFeatures } from "@/components/landing/features";
import { ArchitectureDiagram } from "@/components/landing/architecture-diagram";
import { LandingSecurity } from "@/components/landing/security";
import { LandingFaq } from "@/components/landing/faq";
import { LandingFinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { VectorFieldCanvas } from "@/components/landing/field/vector-field-canvas";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has("CODEMIND_SESSION");

    return (
        <main className="dark min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 relative">
            <VectorFieldCanvas />
            <LandingNavbar isAuthenticated={isAuthenticated} />
            <LandingHero isAuthenticated={isAuthenticated} />
            <HowItWorks />
            <ProductShowcase />
            <LandingFeatures />
            <ArchitectureDiagram />
            <LandingSecurity />
            <LandingFaq />
            <LandingFinalCta isAuthenticated={isAuthenticated} />
            <LandingFooter />
        </main>
    );
}

export function LandingSecurity() {
    return (
        <section id="security" className="py-24 relative z-10 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    <div className="w-full md:w-1/3">
                        <h2 className="text-3xl font-semibold tracking-tight font-geist-sans mb-4">
                            Security & Privacy
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We take your code security seriously. Your repositories remain your intellectual property.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Encrypted at Rest</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                GitHub access tokens are AES-encrypted before being stored in the database. CodeMind uses secure HttpOnly SameSite=Lax cookies for session management.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Scoped Access</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Every repository operation is strictly scoped to the signed-in user. You can only interact with repositories you explicitly have access to on GitHub.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Data Storage</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Only your code chunks (max ~200 tokens each) are stored in our vector database (PostgreSQL with pgvector) to enable semantic search.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">GitHub Permissions</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                CodeMind requires the <code>repo</code> scope to access private repositories. We only use this permission to fetch the codebase for indexing; we never commit or modify your code.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center border">
      <SignIn
        appearance={{
          elements: {
            card: "bg-background border-border",
            headerTitle: "text-foreground",
            headerSubtitle: "text-foreground",
            socialButtonsBlockButton: "border-muted text-foreground",
            footerActionText: "text-foreground",
          },
        }}
      />
    </div>
  );
}

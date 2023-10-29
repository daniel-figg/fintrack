import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <SignUp
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

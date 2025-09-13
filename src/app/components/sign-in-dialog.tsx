import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Image from "next/image"

const SignInDialog = () => {
  const handleLoginWithGoogle = () => {
    signIn("google")
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Faca login em nossa plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta Google.
        </DialogDescription>
      </DialogHeader>
      <Button
        variant="outline"
        className="gap-2 font-bold"
        onClick={handleLoginWithGoogle}
      >
        <Image src="/Google.svg" width={18} height={18} alt=""></Image>
        Google
      </Button>
    </>
  )
}

export default SignInDialog

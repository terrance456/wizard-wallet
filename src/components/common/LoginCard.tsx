import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import SignInButton from "./SignInButton";

const LoginCard: React.FC = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Wizard Wallet</CardTitle>
        <CardDescription>Manage your finance with ease</CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        <SignInButton className="w-full" variant="default">
          Google
        </SignInButton>
      </CardContent>
    </Card>
  );
};

export default LoginCard;

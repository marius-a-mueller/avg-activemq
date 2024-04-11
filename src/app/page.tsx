"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function Page() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex justify-center items-center">
      <Card className="h-[600px] w-[800px] mt-20">
        <CardHeader>
          <CardTitle> Prepare your message</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label>Message</Label>
          <Input value={message} onChange={(e: any) => setMessage(e)} />
          <Button>Send Message</Button>
        </CardContent>
      </Card>
    </div>
  );
}

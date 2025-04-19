import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {Button} from "@/components/ui/button.tsx";

import {Badge} from "@/components/ui/badge.tsx";

import {SshKey} from "@/types.ts";
import {fdate} from "@/lib/utils.ts";

export default function KeyCard(props: SshKey) {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-4">
                <CardTitle>{props.name}</CardTitle>
                <Badge variant="secondary">{fdate(props.created_at)}</Badge>
            </CardHeader>
            <CardContent>
                <p>Path: {props.path}</p>
            </CardContent>
            <CardFooter>
                <Button variant="destructive">Delete</Button>
            </CardFooter>
        </Card>
    );
}
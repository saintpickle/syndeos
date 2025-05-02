import {Card, CardHeader, CardTitle} from "@/components/ui/card";

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit ornare lectus. Morbi bibendum ultrices eros nec porta.";

export default function ServersPage() {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Server 1</CardTitle>
                    <p>{lorem}</p>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Server 2</CardTitle>
                    <p>{lorem}</p>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Server 3</CardTitle>
                    <p>{lorem}</p>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Server 4</CardTitle>
                    <p>{lorem}</p>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Server 5</CardTitle>
                    <p>{lorem}</p>
                </CardHeader>
            </Card>
        </div>
    );
}
export default function SettingsPage() {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>Setting 1</p>
            </div>
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>Setting 2</p>
            </div>
            <div className="aspect-video rounded-xl bg-white text-3xl flex justify-center items-center">
                <p>Setting 3</p>
            </div>
        </div>
    );
}
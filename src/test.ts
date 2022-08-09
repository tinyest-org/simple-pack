import { BasicStructConvertor, makeSchemaBuilder } from ".";

const test = () => {
    enum Version {
        v1 = "1",
        v2 = "2",
    }
    const createSchema = makeSchemaBuilder<Version>();

    const v1 = createSchema({ version: Version.v1, item: { url: "" } });

    const v2 = createSchema({ version: Version.v2, item: { deb: "" } });

    const a = new BasicStructConvertor([v1, v2]);

    const s = a.to({
        version: Version.v1,
        item: {
            url: "deb.com",
        }
    });
    console.log(s);

    const r = a.from(s);
    if (r.version === Version.v1) {
        console.log('got v1', r.item.url)
        console.log(r.item.url === "deb.com");
    }

    console.log(r);

    const s2 = "2>zfIUG";

    const r2 = a.from(s2);
    if (r2.version === Version.v2) {
        console.log('got v2', r2.item.deb)
    }

    console.log(r2);
}


export { test };
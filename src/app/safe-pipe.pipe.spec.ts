import { SafePipePipe } from "./safe-pipe.pipe";
import { ɵDomSanitizerImpl } from "@angular/platform-browser/";

describe("SafePipePipe", () => {
    it("create an instance", () => {
        const sanitizer = new ɵDomSanitizerImpl(document);
        const pipe = new SafePipePipe(sanitizer);
        expect(pipe).toBeTruthy();
    });
});

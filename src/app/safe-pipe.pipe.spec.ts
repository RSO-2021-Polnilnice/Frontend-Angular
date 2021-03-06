import { SafePipePipe } from "./safe-pipe.pipe";
import { ╔ÁDomSanitizerImpl } from "@angular/platform-browser/";

describe("SafePipePipe", () => {
    it("create an instance", () => {
        const sanitizer = new ╔ÁDomSanitizerImpl(document);
        const pipe = new SafePipePipe(sanitizer);
        expect(pipe).toBeTruthy();
    });
});

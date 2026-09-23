import { assertEquals, assertGreater } from "jsr:@std/assert";
import { parseCInterface, parseCppInterface, parsePythonInterface } from "../src/core/parser.ts";

Deno.test("Parser - C function prototypes with comments & pointers", () => {
  const cSource = `
  // Compute square root
  double calc_sqrt(double val);

  /**
   * String copy buffer function
   */
  int str_copy(const char* src, char* dst, int max_len);
  `;

  const parsed = parseCInterface(cSource);
  assertEquals(parsed.functions.length, 2);
  assertEquals(parsed.functions[0].name, "calc_sqrt");
  assertEquals(parsed.functions[0].returnType.type, "number");
  assertEquals(parsed.functions[0].parameters.length, 1);
  assertEquals(parsed.functions[0].parameters[0].name, "val");

  assertEquals(parsed.functions[1].name, "str_copy");
  assertEquals(parsed.functions[1].parameters.length, 3);
  assertEquals(parsed.functions[1].parameters[0].isPointer, true);
  assertEquals(parsed.functions[1].parameters[0].isConst, true);
});

Deno.test("Parser - C++ class methods and namespaces", () => {
  const cppSource = `
  namespace Physics {
    class VectorEngine {
    public:
      // Normalize a vector in place
      bool normalize(std::vector<double>& vec, double tolerance = 0.001);

      // Dot product calculation
      double dot(const std::vector<double>& a, const std::vector<double>& b);
    };
  }
  `;

  const parsed = parseCppInterface(cppSource);
  assertEquals(parsed.functions.length, 2);
  assertEquals(parsed.functions[0].name, "normalize");
  assertEquals(parsed.functions[0].className, "VectorEngine");
  assertEquals(parsed.functions[0].namespace, "Physics");
  assertEquals(parsed.functions[0].parameters.length, 2);
  assertEquals(parsed.functions[0].parameters[1].defaultValue, "0.001");
  assertEquals(parsed.functions[0].parameters[1].isOptional, true);

  assertEquals(parsed.functions[1].name, "dot");
  assertEquals(parsed.functions[1].returnType.type, "number");
});

Deno.test("Parser - Python3 function definitions with type hints & docstrings", () => {
  const pySource = `
class NeuralBridge:
    def predict_tokens(self, prompt: str, max_tokens: int = 128, temperature: float = 0.7) -> list[str]:
        """
        Generate tokens from prompt with temperature sampling.
        """
        pass

    async def ping_health(self) -> bool:
        """Health check."""
        return True
  `;

  const parsed = parsePythonInterface(pySource);
  assertEquals(parsed.functions.length, 2);
  assertEquals(parsed.functions[0].name, "predict_tokens");
  assertEquals(parsed.functions[0].className, "NeuralBridge");
  assertEquals(parsed.functions[0].parameters.length, 3);
  assertEquals(parsed.functions[0].parameters[0].name, "prompt");
  assertEquals(parsed.functions[0].parameters[0].type, "string");
  assertEquals(parsed.functions[0].parameters[1].defaultValue, "128");
  assertEquals(parsed.functions[0].doc?.includes("Generate tokens"), true);

  assertEquals(parsed.functions[1].name, "ping_health");
  assertEquals(parsed.functions[1].returnType.type, "boolean");
});

import { getSql } from "@/lib/db";
import type { Language, ValidationRule } from "./types";

type SeedError = {
  id: string;
  errorType: "syntax" | "logic";
  description: string;
  location: string;
  expectedCorrection: string;
  marks: number;
  validationRule: ValidationRule;
};

type SeedQuestion = {
  id: string;
  title: string;
  language: Language;
  description: string;
  buggyCode: string;
  correctCode: string;
  slot: number;
  errors: SeedError[];
  tests: { id: string; visibility: "visible" | "hidden"; stdin: string; expectedStdout: string }[];
};

const Q1_BUGGY = `Class Stack:
       def _init_(self):
            self.items = []
def push(item):
    self.items.add(item)
    print("Pushed {item} onto stack")
def pop(self):
     if not is_empty():
        return None 
    return self.items.pop()
def peek(self):
   	    return self.items[0]
   if name == main:
stack.push(10)
stack.push(30)
print("Top element:", stack.peek)
print("Popped element:", stack.pop())
`;

const Q1_CORRECT = `class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)
        print(f"Pushed {item} onto stack")

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        return self.items[-1]

if __name__ == "__main__":
    stack = Stack()
    stack.push(10)
    stack.push(30)
    print("Top element:", stack.peek())
    print("Popped element:", stack.pop())
`;

const Q2_BUGGY = `#include <stdio.h>

int main() {
    int a[6] = {12, 25, 18, 30, 15, 20}
    int sum = 0, count = 0;
    int avg;
    int i;

    for(i = 0; i <= 6; i++)
        sum = a[i];

    avg = sum / 5;

    for(i = 0; i < 6; i++) {
        if(a[i] > avg);
            count--;
    }

    printf("Average = %.2f\\n", avg);
    printf("Count = %d\\n", count)

    return 1;
}
`;

const Q2_CORRECT = `#include <stdio.h>

int main() {
    int a[6] = {12, 25, 18, 30, 15, 20};
    int sum = 0, count = 0;
    float avg;
    int i;

    for(i = 0; i < 6; i++)
        sum += a[i];

    avg = sum / 6.0;

    for(i = 0; i < 6; i++) {
        if(a[i] > avg)
            count++;
    }

    printf("Average = %.2f\\n", avg);
    printf("Count = %d\\n", count);

    return 0;
}
`;

const Q3_BUGGY = `#include <stdio.h>

int fib(int n) {
    if (n = 0)
        return 0
    if (n == 1)
        return 1;
    return fib(n - 1) + fib(n - 2)
}

void updateArray(int arr[], int n) {
    for (int i = 0; i <= n; i++)
        arr[i] = arr[i] * 2;
}

int main() {
    int nums[5] = {1, 2, 3, 4, 5}
    int *ptr = nums;

    updateArray(nums, 5);

    for (int i = 0; i < 5; i++)
        printf("%d ", *ptr + i)

    int result = fib(6)
    printf("\\nFib(6) = %d", result);

    int total;
    for (int i = 0; i < 5; i--)
        total += nums[i];
    printf("\\nTotal = %d", total)
}
`;

const Q3_CORRECT = `#include <stdio.h>

int fib(int n) {
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;
    return fib(n - 1) + fib(n - 2);
}

void updateArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        arr[i] = arr[i] * 2;
}

int main() {
    int nums[5] = {1, 2, 3, 4, 5};
    int *ptr = nums;

    updateArray(nums, 5);

    for (int i = 0; i < 5; i++)
        printf("%d ", *(ptr + i));

    int result = fib(6);
    printf("\\nFib(6) = %d", result);

    int total = 0;
    for (int i = 0; i < 5; i++)
        total += nums[i];
    printf("\\nTotal = %d", total);
    return 0;
}
`;

const Q4_BUGGY = `def word_count(text):
    words = text.split(" ")
    counts = {}
    for word in words:
        word = word.lower()
        if word in counts
            counts[word] = counts[word] + 1
        else:
            counts[word] == 1
    return counts

def most_common(counts):
    max_word = None
    max_count = 0
    for word, count in counts.items()
        if count > max_count:
            max_word == word
            max_count = count
    return max_word

if __name__ = "__main__":
    text = "Bug Hunt bug hunt BUG"
    result = word_count(text)
    print(most_common(result))
`;

const Q4_CORRECT = `def word_count(text):
    words = text.split(" ")
    counts = {}
    for word in words:
        word = word.lower()
        if word in counts:
            counts[word] = counts[word] + 1
        else:
            counts[word] = 1
    return counts

def most_common(counts):
    max_word = None
    max_count = 0
    for word, count in counts.items():
        if count > max_count:
            max_word = word
            max_count = count
    return max_word

if __name__ == "__main__":
    text = "Bug Hunt bug hunt BUG"
    result = word_count(text)
    print(most_common(result))
`;

const Q5_BUGGY = `def factorial(n):
    if n = 0:
        return 1
    return n * factorial(n - 1)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return True
    return False

def reverse_list(items):
    result = []
    for i in range(len(items)):
        result.append(items[i])
    return result

print("Fact(5) =", factorial(5))
print("Is 7 prime?", is_prime(7))
print("Reversed:", reverse_list([1, 2, 3, 4]))
`;

const Q5_CORRECT = `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def reverse_list(items):
    result = []
    for i in range(len(items) - 1, -1, -1):
        result.append(items[i])
    return result

print("Fact(5) =", factorial(5))
print("Is 7 prime?", is_prime(7))
print("Reversed:", reverse_list([1, 2, 3, 4]))
`;

const Q6_BUGGY = `#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {
    int n = strlen(str)
    int i;
    for (i = 0; i < n / 2; i++) {
        if (str[i] != str[n - i])
            return 0;
    }
    return 1;
}

int main() {
    char word[20] = "level"
    int result = isPalindrome(word)
    if (result = 1)
        printf("Palindrome\\n")
    else
        printf("Not a palindrome\\n");
    return 0;
}
`;

const Q6_CORRECT = `#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {
    int n = strlen(str);
    int i;
    for (i = 0; i < n / 2; i++) {
        if (str[i] != str[n - i - 1])
            return 0;
    }
    return 1;
}

int main() {
    char word[20] = "level";
    int result = isPalindrome(word);
    if (result == 1)
        printf("Palindrome\\n");
    else
        printf("Not a palindrome\\n");
    return 0;
}
`;

const BANK: SeedQuestion[] = [
  {
    id: "q-stack",
    title: "Debug the Stack Implementation",
    language: "python",
    slot: 1,
    description:
      "## Objective\nDebug this Python **Stack** so `push`, `pop`, and `peek` work from a main block.\n\n### Restore\n- Class structure and constructor\n- List operations (`append`, top index `-1`)\n- Main guard and object construction\n\nThe intended demo pushes `10` then `30`, prints the top, then pops.",
    buggyCode: Q1_BUGGY,
    correctCode: Q1_CORRECT,
    errors: [
      {
        id: "q-stack-e01",
        errorType: "syntax",
        description: "'Class' should be lowercase 'class'.",
        location: "line 1",
        expectedCorrection: "class Stack:",
        marks: 2,
        validationRule: { type: "regex", pattern: "\\bclass\\s+Stack\\b" },
      },
      {
        id: "q-stack-e02",
        errorType: "syntax",
        description: "'_init_' should be '__init__'.",
        location: "constructor",
        expectedCorrection: "def __init__(self):",
        marks: 2,
        validationRule: { type: "contains", value: "__init__" },
      },
      {
        id: "q-stack-e03",
        errorType: "syntax",
        description: "push() is missing the self parameter.",
        location: "push",
        expectedCorrection: "def push(self, item):",
        marks: 2,
        validationRule: { type: "regex", pattern: "def\\s+push\\(\\s*self\\s*," },
      },
      {
        id: "q-stack-e04",
        errorType: "logic",
        description: "Lists use append(), not add().",
        location: "push body",
        expectedCorrection: "self.items.append(item)",
        marks: 2,
        validationRule: { type: "regex", pattern: "self\\.items\\.append\\s*\\(" },
      },
      {
        id: "q-stack-e05",
        errorType: "syntax",
        description: "The print statement requires an f-string to display the item value.",
        location: "push print",
        expectedCorrection: 'print(f"Pushed {item} onto stack")',
        marks: 1,
        validationRule: {
          type: "any",
          rules: [
            { type: "regex", pattern: "print\\(\\s*f['\\\"]Pushed" },
            { type: "regex", pattern: "print\\(.*\\.format\\(" },
            { type: "regex", pattern: "print\\(.*%\\s*item" },
            { type: "regex", pattern: "print\\([^)]*\\+\\s*str\\(item\\)" },
          ],
        },
      },
      {
        id: "q-stack-e06",
        errorType: "logic",
        description: "pop() should call self.is_empty() according to the intended class design.",
        location: "pop",
        expectedCorrection: "if self.is_empty():",
        marks: 2,
        validationRule: { type: "contains", value: "self.is_empty()" },
      },
      {
        id: "q-stack-e07",
        errorType: "logic",
        description: "peek() should use [-1] for the top element.",
        location: "peek",
        expectedCorrection: "return self.items[-1]",
        marks: 2,
        validationRule: { type: "regex", pattern: "self\\.items\\s*\\[\\s*-1\\s*\\]" },
      },
      {
        id: "q-stack-e08",
        errorType: "syntax",
        description: "'__name__ == \"__main__\"' should be used.",
        location: "main guard",
        expectedCorrection: 'if __name__ == "__main__":',
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "__name__\\s*==\\s*['\\\"]__main__['\\\"]",
        },
      },
      {
        id: "q-stack-e09",
        errorType: "logic",
        description: "A Stack object must be created, e.g. stack = Stack().",
        location: "main",
        expectedCorrection: "stack = Stack()",
        marks: 2,
        validationRule: { type: "regex", pattern: "stack\\s*=\\s*Stack\\s*\\(" },
      },
      {
        id: "q-stack-e10",
        errorType: "syntax",
        description: "stack.peek() requires parentheses.",
        location: "main print",
        expectedCorrection: "stack.peek()",
        marks: 1,
        validationRule: { type: "regex", pattern: "stack\\.peek\\s*\\(" },
      },
    ],
    tests: [
      {
        id: "q-stack-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout:
          "Pushed 10 onto stack\nPushed 30 onto stack\nTop element: 30\nPopped element: 30",
      },
    ],
  },
  {
    id: "q-average",
    title: "Debug the Array Average Program",
    language: "c",
    slot: 2,
    description:
      "## Objective\nThis C program should compute the **average** of six integers and count how many values are strictly greater than that average.\n\n### Watch for\n- Missing semicolons\n- Off-by-one loops\n- Integer division\n- `count++` vs `count--`\n\nPrint the average to two decimal places, then the count.",
    buggyCode: Q2_BUGGY,
    correctCode: Q2_CORRECT,
    errors: [
      {
        id: "q-average-e01",
        errorType: "syntax",
        description: "Missing semicolon after the array declaration.",
        location: "array declaration",
        expectedCorrection: "int a[6] = {12, 25, 18, 30, 15, 20};",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "int\\s+a\\s*\\[\\s*6\\s*\\]\\s*=\\s*\\{[^}]+\\}\\s*;",
        },
      },
      {
        id: "q-average-e02",
        errorType: "logic",
        description: "avg should be float to hold the average.",
        location: "avg declaration",
        expectedCorrection: "float avg;",
        marks: 2,
        validationRule: { type: "regex", pattern: "(float|double)\\s+avg\\b" },
      },
      {
        id: "q-average-e03",
        errorType: "logic",
        description: "i <= 6 should be i < 6 to avoid going outside the array.",
        location: "first loop",
        expectedCorrection: "for(i = 0; i < 6; i++)",
        marks: 2,
        validationRule: { type: "not_contains", value: "i <= 6" },
      },
      {
        id: "q-average-e04",
        errorType: "logic",
        description: "sum = a[i] should be sum += a[i].",
        location: "summation",
        expectedCorrection: "sum += a[i];",
        marks: 2,
        validationRule: { type: "regex", pattern: "sum\\s*\\+=\\s*a\\s*\\[" },
      },
      {
        id: "q-average-e05",
        errorType: "logic",
        description: "Average divisor should be 6, not 5.",
        location: "average",
        expectedCorrection: "avg = sum / 6.0;",
        marks: 2,
        validationRule: { type: "regex", pattern: "sum\\s*/\\s*6" },
      },
      {
        id: "q-average-e06",
        errorType: "logic",
        description: "Integer division must be avoided when calculating the average.",
        location: "average",
        expectedCorrection: "sum / 6.0 or (float)sum / 6",
        marks: 2,
        validationRule: {
          type: "any",
          rules: [
            { type: "regex", pattern: "sum\\s*/\\s*6\\.0" },
            { type: "regex", pattern: "\\(float\\)\\s*sum" },
            { type: "regex", pattern: "\\(double\\)\\s*sum" },
            { type: "regex", pattern: "sum\\s*/\\s*6\\.0f" },
          ],
        },
      },
      {
        id: "q-average-e07",
        errorType: "syntax",
        description: "Stray semicolon after if(a[i] > avg) must be removed.",
        location: "count loop",
        expectedCorrection: "if(a[i] > avg)",
        marks: 2,
        validationRule: {
          type: "all",
          rules: [
            { type: "not_contains", value: "if(a[i] > avg);" },
            { type: "not_contains", value: "if (a[i] > avg);" },
          ],
        },
      },
      {
        id: "q-average-e08",
        errorType: "logic",
        description: "count-- should be count++.",
        location: "count loop",
        expectedCorrection: "count++;",
        marks: 2,
        validationRule: { type: "contains", value: "count++" },
      },
      {
        id: "q-average-e09",
        errorType: "logic",
        description: "%.2f requires a floating-point value for avg.",
        location: "printf average",
        expectedCorrection: "float avg used with %.2f",
        marks: 1,
        validationRule: { type: "regex", pattern: "(float|double)\\s+avg\\b" },
      },
      {
        id: "q-average-e10",
        errorType: "syntax",
        description: "Missing semicolon after printf Count.",
        location: "second printf",
        expectedCorrection: 'printf("Count = %d\\n", count);',
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "printf\\(\\s*\"Count = %d\\\\n\"\\s*,\\s*count\\s*\\)\\s*;",
        },
      },
      {
        id: "q-average-e11",
        errorType: "logic",
        description:
          "return 1 is conventionally return 0 for successful execution (optional).",
        location: "return",
        expectedCorrection: "return 0;",
        marks: 1,
        validationRule: { type: "regex", pattern: "return\\s+0\\s*;" },
      },
    ],
    tests: [
      {
        id: "q-average-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout: "Average = 20.00\nCount = 2",
      },
    ],
  },
  {
    id: "q-fibonacci",
    title: "Debug the Fibonacci and Array Program",
    language: "c",
    slot: 3,
    description:
      "## Objective\nDouble each array element, print the updated array with a pointer, compute `Fib(6)`, and print the sum.\n\n### Watch for\n- Assignment vs comparison (`=` / `==`)\n- Missing semicolons\n- Uninitialized `total`\n- Pointer arithmetic `*(ptr + i)`",
    buggyCode: Q3_BUGGY,
    correctCode: Q3_CORRECT,
    errors: [
      {
        id: "q-fib-e01",
        errorType: "logic",
        description: "n = 0 should be n == 0.",
        location: "fib base case",
        expectedCorrection: "if (n == 0)",
        marks: 2,
        validationRule: { type: "regex", pattern: "if\\s*\\(\\s*n\\s*==\\s*0\\s*\\)" },
      },
      {
        id: "q-fib-e02",
        errorType: "syntax",
        description: "Missing semicolon after return 0.",
        location: "fib",
        expectedCorrection: "return 0;",
        marks: 2,
        validationRule: { type: "regex", pattern: "return\\s+0\\s*;" },
      },
      {
        id: "q-fib-e03",
        errorType: "syntax",
        description: "Missing semicolon after the recursive return.",
        location: "fib",
        expectedCorrection: "return fib(n - 1) + fib(n - 2);",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "return\\s+fib\\s*\\(\\s*n\\s*-\\s*1\\s*\\)\\s*\\+\\s*fib\\s*\\(\\s*n\\s*-\\s*2\\s*\\)\\s*;",
        },
      },
      {
        id: "q-fib-e04",
        errorType: "logic",
        description: "i <= n should be i < n.",
        location: "updateArray",
        expectedCorrection: "for (int i = 0; i < n; i++)",
        marks: 2,
        validationRule: { type: "not_contains", value: "i <= n" },
      },
      {
        id: "q-fib-e05",
        errorType: "syntax",
        description: "Missing semicolon after nums array declaration.",
        location: "main",
        expectedCorrection: "int nums[5] = {1, 2, 3, 4, 5};",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "int\\s+nums\\s*\\[\\s*5\\s*\\]\\s*=\\s*\\{[^}]+\\}\\s*;",
        },
      },
      {
        id: "q-fib-e06",
        errorType: "logic",
        description: "*ptr + i is incorrect; use pointer/array indexing.",
        location: "print loop",
        expectedCorrection: "*(ptr + i) or ptr[i]",
        marks: 2,
        validationRule: {
          type: "any",
          rules: [
            { type: "regex", pattern: "\\*\\s*\\(\\s*ptr\\s*\\+\\s*i\\s*\\)" },
            { type: "regex", pattern: "ptr\\s*\\[\\s*i\\s*\\]" },
          ],
        },
      },
      {
        id: "q-fib-e07",
        errorType: "syntax",
        description: "Missing semicolon after printf inside the loop.",
        location: "print loop",
        expectedCorrection: 'printf("%d ", *(ptr + i));',
        marks: 1,
        validationRule: {
          type: "regex",
          pattern: "printf\\(\\s*\"%d \"\\s*,.*\\)\\s*;",
        },
      },
      {
        id: "q-fib-e08",
        errorType: "syntax",
        description: "Missing semicolon after int result = fib(6).",
        location: "main",
        expectedCorrection: "int result = fib(6);",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "int\\s+result\\s*=\\s*fib\\s*\\(\\s*6\\s*\\)\\s*;",
        },
      },
      {
        id: "q-fib-e09",
        errorType: "logic",
        description: "total is uninitialized.",
        location: "total",
        expectedCorrection: "int total = 0;",
        marks: 2,
        validationRule: { type: "regex", pattern: "int\\s+total\\s*=\\s*0\\s*;" },
      },
      {
        id: "q-fib-e10",
        errorType: "logic",
        description: "i-- should be i++.",
        location: "sum loop",
        expectedCorrection: "for (int i = 0; i < 5; i++)",
        marks: 2,
        validationRule: {
          type: "all",
          rules: [
            { type: "not_contains", value: "i--" },
            { type: "contains", value: "i++" },
          ],
        },
      },
      {
        id: "q-fib-e11",
        errorType: "syntax",
        description: "Missing semicolon after final printf.",
        location: "final printf",
        expectedCorrection: 'printf("\\nTotal = %d", total);',
        marks: 1,
        validationRule: {
          type: "regex",
          pattern: "printf\\(\\s*\"\\\\nTotal = %d\"\\s*,\\s*total\\s*\\)\\s*;",
        },
      },
    ],
    tests: [
      {
        id: "q-fib-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout: "2 4 6 8 10 \nFib(6) = 8\nTotal = 30",
      },
    ],
  },
  {
    id: "q-wordcount",
    title: "Debug the Word Frequency Program",
    language: "python",
    slot: 4,
    description:
      "## Objective\nCount word frequencies (case-insensitive) and print the **most common** word.\n\n### Watch for\n- Missing colons\n- `=` vs `==` on dictionary writes\n- Main guard comparison",
    buggyCode: Q4_BUGGY,
    correctCode: Q4_CORRECT,
    errors: [
      {
        id: "q-word-e01",
        errorType: "syntax",
        description: "Missing colon after if word in counts.",
        location: "word_count",
        expectedCorrection: "if word in counts:",
        marks: 2,
        validationRule: { type: "regex", pattern: "if\\s+word\\s+in\\s+counts\\s*:" },
      },
      {
        id: "q-word-e02",
        errorType: "logic",
        description: "counts[word] == 1 should assign, not compare.",
        location: "else branch",
        expectedCorrection: "counts[word] = 1",
        marks: 2,
        validationRule: {
          type: "all",
          rules: [
            { type: "regex", pattern: "counts\\s*\\[\\s*word\\s*\\]\\s*=\\s*1" },
            { type: "not_contains", value: "counts[word] == 1" },
          ],
        },
      },
      {
        id: "q-word-e03",
        errorType: "syntax",
        description: "Missing colon after for word, count in counts.items().",
        location: "most_common",
        expectedCorrection: "for word, count in counts.items():",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "for\\s+word\\s*,\\s*count\\s+in\\s+counts\\.items\\(\\s*\\)\\s*:",
        },
      },
      {
        id: "q-word-e04",
        errorType: "logic",
        description: "max_word == word should assign, not compare.",
        location: "most_common",
        expectedCorrection: "max_word = word",
        marks: 2,
        validationRule: {
          type: "all",
          rules: [
            { type: "regex", pattern: "max_word\\s*=\\s*word" },
            { type: "not_contains", value: "max_word == word" },
          ],
        },
      },
      {
        id: "q-word-e05",
        errorType: "syntax",
        description: "__name__ = \"__main__\" should use ==.",
        location: "main guard",
        expectedCorrection: 'if __name__ == "__main__":',
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "__name__\\s*==\\s*['\\\"]__main__['\\\"]",
        },
      },
    ],
    tests: [
      {
        id: "q-word-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout: "bug",
      },
    ],
  },
  {
    id: "q-numbers",
    title: "Debug the Factorial, Prime, and Reverse Program",
    language: "python",
    slot: 5,
    description:
      "## Objective\nCompute `factorial(5)`, test whether `7` is prime, and reverse a list.\n\n### Watch for\n- `if n = 0` should compare\n- Prime-check return values are inverted\n- Reverse currently copies instead of reversing",
    buggyCode: Q5_BUGGY,
    correctCode: Q5_CORRECT,
    errors: [
      {
        id: "q-num-e01",
        errorType: "syntax",
        description: "if n = 0 should be if n == 0.",
        location: "factorial",
        expectedCorrection: "if n == 0:",
        marks: 3,
        validationRule: { type: "regex", pattern: "if\\s+n\\s*==\\s*0\\s*:" },
      },
      {
        id: "q-num-e02",
        errorType: "logic",
        description: "A found divisor means the number is not prime; return False.",
        location: "is_prime loop",
        expectedCorrection: "return False",
        marks: 3,
        validationRule: {
          type: "regex",
          pattern: "if\\s+n\\s*%\\s*i\\s*==\\s*0\\s*:\\s*\\n\\s*return\\s+False",
        },
      },
      {
        id: "q-num-e03",
        errorType: "logic",
        description: "If no divisor is found, is_prime should return True.",
        location: "is_prime end",
        expectedCorrection: "return True",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "return\\s+True\\s*\\n\\s*\\n\\s*def\\s+reverse_list",
        },
      },
      {
        id: "q-num-e04",
        errorType: "logic",
        description: "reverse_list currently copies the list; it must reverse it.",
        location: "reverse_list",
        expectedCorrection: "iterate backwards, slice [::-1], or reversed()",
        marks: 2,
        validationRule: {
          type: "any",
          rules: [
            { type: "contains", value: "[::-1]" },
            { type: "regex", pattern: "reversed\\s*\\(" },
            { type: "regex", pattern: "insert\\s*\\(\\s*0" },
            { type: "regex", pattern: "range\\s*\\(\\s*len\\s*\\(\\s*items\\s*\\)\\s*-\\s*1\\s*,\\s*-1\\s*,\\s*-1\\s*\\)" },
          ],
        },
      },
    ],
    tests: [
      {
        id: "q-num-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout: "Fact(5) = 120\nIs 7 prime? True\nReversed: [4, 3, 2, 1]",
      },
    ],
  },
  {
    id: "q-palindrome",
    title: "Debug the Palindrome Checker",
    language: "c",
    slot: 6,
    description:
      "## Objective\nDecide whether `\"level\"` is a palindrome and print `Palindrome` or `Not a palindrome`.\n\n### Watch for\n- Missing semicolons\n- Mirror index `n - i - 1`\n- `if (result = 1)` assignment",
    buggyCode: Q6_BUGGY,
    correctCode: Q6_CORRECT,
    errors: [
      {
        id: "q-pal-e01",
        errorType: "syntax",
        description: "Missing semicolon after strlen(str).",
        location: "isPalindrome",
        expectedCorrection: "int n = strlen(str);",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "int\\s+n\\s*=\\s*strlen\\s*\\(\\s*str\\s*\\)\\s*;",
        },
      },
      {
        id: "q-pal-e02",
        errorType: "logic",
        description: "str[n - i] should be str[n - i - 1] to compare mirrored characters.",
        location: "comparison",
        expectedCorrection: "str[n - i - 1]",
        marks: 3,
        validationRule: {
          type: "regex",
          pattern: "str\\s*\\[\\s*n\\s*-\\s*i\\s*-\\s*1\\s*\\]",
        },
      },
      {
        id: "q-pal-e03",
        errorType: "syntax",
        description: "Missing semicolon after the word declaration.",
        location: "main",
        expectedCorrection: 'char word[20] = "level";',
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "char\\s+word\\s*\\[\\s*20\\s*\\]\\s*=\\s*\"level\"\\s*;",
        },
      },
      {
        id: "q-pal-e04",
        errorType: "syntax",
        description: "Missing semicolon after isPalindrome(word).",
        location: "main",
        expectedCorrection: "int result = isPalindrome(word);",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "int\\s+result\\s*=\\s*isPalindrome\\s*\\(\\s*word\\s*\\)\\s*;",
        },
      },
      {
        id: "q-pal-e05",
        errorType: "logic",
        description: "if (result = 1) assigns; it should compare with ==.",
        location: "if",
        expectedCorrection: "if (result == 1)",
        marks: 2,
        validationRule: {
          type: "regex",
          pattern: "if\\s*\\(\\s*result\\s*==\\s*1\\s*\\)",
        },
      },
      {
        id: "q-pal-e06",
        errorType: "syntax",
        description: "Missing semicolon after printf(\"Palindrome\\n\").",
        location: "true branch",
        expectedCorrection: 'printf("Palindrome\\n");',
        marks: 1,
        validationRule: {
          type: "regex",
          pattern: "printf\\(\\s*\"Palindrome\\\\n\"\\s*\\)\\s*;",
        },
      },
    ],
    tests: [
      {
        id: "q-pal-t1",
        visibility: "visible",
        stdin: "",
        expectedStdout: "Palindrome",
      },
    ],
  },
];

export async function ensureSeeded(): Promise<void> {
  const sql = await getSql();
  const settings = await sql`select id from competition_settings where id = 'default'`;
  if (settings.length === 0) {
    await sql`
      insert into competition_settings (id, timer_minutes, malpractice_policy, malpractice_limit, status, questions_locked)
      values ('default', 45, 'terminate_after', 3, 'open', false)
    `;
  }
  await insertMissingSeedQuestions();
}

export async function insertMissingSeedQuestions(): Promise<number> {
  const sql = await getSql();
  let added = 0;
  for (const [index, q] of BANK.entries()) {
    const found = await sql<{ id: string }>`select id from questions where id = ${q.id} limit 1`;
    if (found.length > 0) continue;
    const slotTaken = await sql<{ id: string }>`
      select id from questions where selected_slot = ${q.slot} limit 1
    `;
    const slot = slotTaken.length > 0 ? null : q.slot;
    await sql`
      insert into questions (id, title, language, description, buggy_code, correct_code, sort_order, selected_slot, is_active)
      values (${q.id}, ${q.title}, ${q.language}, ${q.description}, ${q.buggyCode}, ${q.correctCode}, ${index + 1}, ${slot}, true)
    `;
    for (const [ei, err] of q.errors.entries()) {
      await sql`
        insert into question_errors (id, question_id, error_type, description, location, expected_correction, marks, validation_rule, sort_order, is_active)
        values (
          ${err.id}, ${q.id}, ${err.errorType}, ${err.description}, ${err.location},
          ${err.expectedCorrection}, ${err.marks}, ${JSON.stringify(err.validationRule)}, ${ei + 1}, true
        )
      `;
    }
    for (const [ti, t] of q.tests.entries()) {
      await sql`
        insert into test_cases (id, question_id, visibility, stdin, expected_stdout, sort_order)
        values (${t.id}, ${q.id}, ${t.visibility}, ${t.stdin}, ${t.expectedStdout}, ${ti + 1})
      `;
    }
    added += 1;
  }
  return added;
}


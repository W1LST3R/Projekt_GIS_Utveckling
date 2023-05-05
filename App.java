import org.json.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class App {
    public static void main(String[] args) throws Exception {
        try {
            // read the JSON file
            String file = "src/coords.json";
            String jsonStr = readFileAsString(file);
            JSONObject json = new JSONObject(jsonStr);
            JSONArray coordinates = json.getJSONArray("coordinates");
            
            // flip the coordinates
            for (int i = 0; i < coordinates.length() / 2; i++) {
                int j = coordinates.length() - i - 1;
                JSONObject temp = coordinates.getJSONObject(i);
                coordinates.put(i, coordinates.getJSONObject(j));
                coordinates.put(j, temp);
            }
            
            // write the updated array back to the file
            json.put("coordinates", coordinates);
            // replace with code to write the updated JSON string to a file
            System.out.println(json.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public static String readFileAsString(String file)throws Exception
    {
        return new String(Files.readAllBytes(Paths.get(file)));
    }
}

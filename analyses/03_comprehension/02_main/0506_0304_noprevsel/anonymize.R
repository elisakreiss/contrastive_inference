library(tidyverse)
library(here)

df_normal = read_csv(here("data","03_comprehension","02_main","0506_0304_noprevsel","raw_normal.csv"))
df = read_csv(here("data","03_comprehension","02_main","0506_0304_noprevsel","raw_weird.csv")) %>% 
  bind_rows(df_normal)

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
  )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","03_comprehension","02_main","0506_0304_noprevsel","data.csv"), row.names = FALSE)

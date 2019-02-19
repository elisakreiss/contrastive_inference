library(tidyverse)

df_1 = read_csv(here("data","01_norming","01_pilot","01_ListFeature-norming_p1","raw.csv"))
df_2 = read_csv(here("data","01_norming","01_pilot","02_ListFeature-norming_p2","raw.csv"))
df_3 = read_csv(here("data","01_norming","01_pilot","03_ListFeature-norming_p3","raw.csv"))
df_4 = read_csv(here("data","01_norming","01_pilot","04_ListFeature-norming_p4","raw.csv"))

df1$pilot = "1_name3perceptualfeatures"
df2$pilot = "2_namefirst3things"
df3$pilot = "2_namefirst3perceptualfeatures"
df4$pilot = "2_name3things"

df = bind_rows(df_1,df_2,df_3,df4)

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
                                 )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","01_norming","01_pilot","01-04","data.csv"), row.names = FALSE)
